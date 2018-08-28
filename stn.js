var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'fbtee'
});
 
connection.connect();

	  connection.query( 'select name, C18_lower_territory, C18_sovereign_territory, C21_admin, C21_country, geographic_zone, distance_from_neuchatel from places;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/humans/C18thAuthors.json:
	  connection.query( 'select distinct author_name from authors;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/humans/C18thBooksellers.json:
	  connection.query( 'select distinct client_name from clients where partnership is true;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/humans/C18thReaderProfessions.json:
	  connection.query( 'select translated_profession,economic_sector from professions;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/humans/C18thReaders.json:
	  connection.query( 'select people.person_name, people.status, people.sex, people.title, people.birth_date, people.death_date, professions.translated_profession from people_professions inner join people on people_professions.person_code = people.person_code inner join professions on people_professions.profession_code = professions.profession_code;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/words/C18thBooks.json:
	  connection.query( 'select books.translated_title, authors.author_name, super_books.illegality, keywords.keyword from books_authors inner join books on books_authors.book_code = books.book_code inner join authors on books_authors.author_code = authors.author_code inner join super_books on books.super_book_code = super_books.super_book_code inner join super_books_keywords on super_books_keywords.super_book_code = super_books.super_book_code inner join keywords on super_books_keywords.keyword_code = keywords.keyword_code where books.translated_title is not null;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});

// data/words/C18thGenres.json:
	  connection.query( 'select keyword, definition from keywords;', function (error, results, fields) {
  if (error) throw error;
  console.log('Result: ', results);
});


connection.end();
