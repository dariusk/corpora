var Promise    = require('bluebird')
var mysql      = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'fbtee'
})

function queryPromise (query) {
  return new Promise (function (resolve, reject) {
    connection.query (query, function (error, results, fields) {
      if (error) throw error
      console.warn (JSON.stringify (results, null, 2))
      resolve (results)
    })
  })
}
 
connection.connect()

queryPromise( 'select name, C18_lower_territory, C18_sovereign_territory, C21_admin, C21_country, geographic_zone, distance_from_neuchatel from places;')
  .then (function() {
    // data/humans/C18thAuthors.json:
    return queryPromise( 'select distinct author_name from authors;')
  }).then (function() {
    // data/humans/C18thBooksellers.json:
    return queryPromise( 'select distinct client_name from clients where partnership is true;')
  }).then (function() {
    // data/humans/C18thReaderProfessions.json:
    return queryPromise( 'select translated_profession,economic_sector from professions;')
  }).then (function() {
    // data/humans/C18thReaders.json:
    return queryPromise( 'select people.person_name, people.status, people.sex, people.title, people.birth_date, people.death_date, professions.translated_profession from people_professions inner join people on people_professions.person_code = people.person_code inner join professions on people_professions.profession_code = professions.profession_code;')
  }).then (function() {
    // data/words/C18thBooks.json:
    return queryPromise( 'select books.translated_title, authors.author_name, super_books.illegality, keywords.keyword from books_authors inner join books on books_authors.book_code = books.book_code inner join authors on books_authors.author_code = authors.author_code inner join super_books on books.super_book_code = super_books.super_book_code inner join super_books_keywords on super_books_keywords.super_book_code = super_books.super_book_code inner join keywords on super_books_keywords.keyword_code = keywords.keyword_code where books.translated_title is not null;')
      .then (function (bookResults) {
        var book = {}
        bookResults.forEach (function (row) {
          if (!book[row.translated_title])
            book[row.translated_title] = { hasAuthor: {},
                                           hasKeyword: {} }
          var b = book[row.translated_title]
          b.hasAuthor[row.author_name] = true
          b.hasKeyword[row.keyword] = true
          b.illegality = row.illegality ? true : undefined
        })
        var books = Object.keys(book).map (function (title) {
          var b = book[title], authors = Object.keys(b.hasAuthor), keywords = Object.keys(b.hasKeyword)
          return { title: title,
                   authors: authors,
                   keywords: keywords,
                   illegal: b.illegal }
        })
        return books
      })
  }).then (function() {
    // data/words/C18thGenres.json:
    return queryPromise( 'select keyword, definition from keywords;')
  }).then (function() {
    connection.end()
  })
