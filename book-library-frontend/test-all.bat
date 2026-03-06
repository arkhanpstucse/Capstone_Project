@echo off
echo Testing All Endpoints
echo =====================

echo 1. Testing Backend Health...
curl -s http://localhost:8080/api/books
echo.
echo.

echo 2. Testing Author Search...
curl -s "http://localhost:8080/api/books/author/George%20Orwell"
echo.
echo.

echo 3. Testing Genre Search...
curl -s http://localhost:8080/api/books/genre/FICTION
echo.
echo.

echo 4. Testing Genre Total...
curl -s http://localhost:8080/api/books/genre/FICTION/total
echo.
echo.

echo 5. Testing Publication Search...
curl -s "http://localhost:8080/api/books/publication/Harper"
echo.
echo.

echo 6. Testing Publication Summary...
curl -s "http://localhost:8080/api/books/publication/Harper/summary"
echo.
pause