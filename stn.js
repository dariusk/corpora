var fs = require('fs')
var Promise = require('bluebird')
var mysql = require('mysql')

function extend (a, b) {
  Object.keys(b).forEach (function (k) { a[k] = b[k] })
  return a
}

function isArray (obj) { return Object.prototype.toString.call(obj) === '[object Array]' }

var prefix = "fbtee/"
var prefixStat
try {
  prefixStat = fs.statSync(prefix)
} catch (e) { }
if (!(prefixStat && prefixStat.isDirectory())) {
  console.warn ('making '+prefix)
  fs.mkdirSync(prefix)
}
function writeText (filename, text) {
  fs.writeFileSync (prefix + filename,
                    text)
}
function cleanJSON (obj) {
  if (typeof(obj) !== 'object' || isArray(obj))
    return obj
  var cleaned = {}
  Object.keys(obj).forEach (function (key) {
    var val = obj[key]
    if (!ignore(val))
      cleaned[key] = cleanJSON (val)
  })
  return cleaned
}
function writeJSON (filenameStub, description, values) {
  writeText (filenameStub + '.json', JSON.stringify ({ description: description,
                                                       values: isArray(values) ? Array.prototype.map.call (values, cleanJSON) : values }, null, 2))
}

writeText ("LICENSE",
           "The STN (Société typographique de Neuchâtel) Online Database is provided courtesy of the FBTEE project at University of Western Sydney.\n"
           + "Please review the terms of their license:\n"
           + "http://fbtee.uws.edu.au/\n")

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'fbtee'
})

function queryPromise (query) {
  return new Promise (function (resolve, reject) {
    connection.query (query, function (error, results, fields) {
      if (error) throw error
//      console.warn (JSON.stringify (results, null, 2))
      resolve (results)
    })
  })
}

function getTerm (term) {
  return function (results) {
    return results.map (function (result) { return result[term] })
  }
}

function ignore (value) {
  return value === '' || value === 'null' || value === null
}

var logging = false
function uniqueReduce (results) {
  var seen = {}, byKey = {}, keysEqualValues = true
  results.forEach (function (result) {
    if (typeof(result) === 'object')
      Object.keys(result).forEach (function (key) {
        seen[key] = seen[key] || {}
        seen[key][result[key]] = true
      })
    else
      seen[result] = true
  })
  Object.keys(seen).sort().forEach (function (key) {
    var val = typeof(seen[key]) === 'object' ? Object.keys(seen[key]).sort() : key
//    if (logging)
//      console.warn('key='+key,'val='+val)
    if (val.length === 1)
      val = val[0]
    if (!ignore (val)) {
      byKey[key] = val
      keysEqualValues = keysEqualValues && (key === val)
    }
  })
  var keys = Object.keys(byKey)
  return keys.length === 1 ? byKey[keys[0]] : (keysEqualValues ? Object.keys(byKey) : byKey)
}

var logTerm = 'keyword'
function tagByTerm (term) {
  return function (results) {
    logging = (term === logTerm)
    var byValue = {}, byValueReduced = {}
    results.forEach (function (result) {
      var value = result[term], resultWithoutTerm = extend ({}, result)
      delete resultWithoutTerm[term]
      var otherKeys = Object.keys(resultWithoutTerm)
      if (otherKeys.length === 1)
        resultWithoutTerm = resultWithoutTerm[otherKeys[0]]
      byValue[value] = byValue[value] || []
      byValue[value].push (resultWithoutTerm)
    })
//    if (logging)
//      console.warn('byValue',term,byValue)
    var keysEqualValues = true
    Object.keys(byValue).forEach (function (key) {
      var reduced = uniqueReduce (byValue[key])
      if (!ignore (reduced)) {
        byValueReduced[key] = reduced
        keysEqualValues = keysEqualValues && (key === reduced)
      }
    })
//    if (logging)
//      console.warn('byValueReduced',term,byValueReduced)
    return keysEqualValues ? Object.keys(byValueReduced) : byValueReduced
  }
}

var theSTN = "the 18th-century publishing house, the Société typographique de Neuchâtel"

connection.connect()

queryPromise( 'select name, C18_lower_territory as lower, C18_sovereign_territory as sovereign, C21_admin, C21_country, geographic_zone as zone, distance_from_neuchatel as distance from places;')
  .then (function (places) {
    writeJSON ("C18thBookMarkets",
               "Locations of customers of " + theSTN,
               places.map (function (place) { return extend ({}, place) }))
  })
  .then (function() {
    // data/humans/C18thAuthors.json:
    return queryPromise( 'select distinct author_name from authors;')
      .then (getTerm('author_name'))
      .then (function (authors) {
        writeJSON ("C18thAuthors", "Authors published by " + theSTN, authors)
      })
  }).then (function() {
    // data/humans/C18thBooksellers.json:
    return queryPromise( 'select distinct clients.client_name as name, clients_addresses.address, places.name as place from clients inner join clients_addresses on clients.client_code = clients_addresses.client_code inner join places on clients_addresses.place_code = places.place_code where clients.partnership is true;')
      .then (function (clients) {
        writeJSON ("C18thBookVendors", "Bookseller clients of " + theSTN, clients)
      })
  }).then (function() {
    // data/humans/C18thReaderProfessions.json:
    return queryPromise( 'select translated_profession,economic_sector from professions;')
      .then (tagByTerm ('economic_sector'))
      .then (function (bySector) {
        writeJSON ("C18thReaderProfessions", "Professions of the customers of " + theSTN, bySector)
      })
  }).then (function() {
    // data/humans/C18thReaders.json:
    return queryPromise( 'select people.person_code, people.person_name as name, people.status, people.sex, people.title, people.birth_date, people.death_date, professions.translated_profession as profession from people_professions inner join people on people_professions.person_code = people.person_code inner join professions on people_professions.profession_code = professions.profession_code;')
      .then (tagByTerm ('person_code'))
      .then (function (byPersonCode) {
        writeJSON ("C18thReaders",
                   "People known to " + theSTN,
                   Object.keys(byPersonCode).map (function (personCode) { return byPersonCode[personCode] }))
      })
  }).then (function() {
    // data/words/C18thBooks.json:
    return queryPromise( 'select books.book_code, books.translated_title, authors.author_name, super_books.illegality, keywords.keyword from books_authors inner join books on books_authors.book_code = books.book_code inner join authors on books_authors.author_code = authors.author_code inner join super_books on books.super_book_code = super_books.super_book_code inner join super_books_keywords on super_books_keywords.super_book_code = super_books.super_book_code inner join keywords on super_books_keywords.keyword_code = keywords.keyword_code where books.translated_title is not null;')
      .then (tagByTerm ('translated_title'))
      .then (function (book) {
        delete book["[An original edition / title for this work has not been identified]"]
        delete book["The Rape of the Lock"]  // the meaning of the word has changed
        return Object.keys(book).map (function (title) {
          var b = book[title]
          return { title: title,
                   fbtee: b.book_code,
                   authors: b.author_name,
                   keywords: b.keyword,
                   illegal: !!b.illegality || undefined }
        })
      }).then (function (books) {
        writeJSON ("C18thBooks", "Books published by " + theSTN, books)
      })
  }).then (function() {
    // data/words/C18thGenres.json:
    return queryPromise( 'select keyword, definition from keywords;')
      .then (tagByTerm ('keyword'))
      .then (function (byKeyword) {
        writeJSON ("C18thBookKeywords",
                   "Classification of books published by " + theSTN,
                   byKeyword)
      })
  }).then (function() {
    connection.end()
  })
