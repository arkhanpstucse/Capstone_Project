const axios = require('axios');

async function testConnection() {
  console.log('🔍 Testing Backend Connection...');
  console.log('===============================');
  
  const backends = [
    'http://localhost:8080/api/books',
    'http://127.0.0.1:8080/api/books',
    'http://localhost:8081/api/books'  // in case you're using different port
  ];
  
  for (const url of backends) {
    try {
      console.log(`\nTesting: ${url}`);
      const response = await axios.get(url, { timeout: 3000 });
      console.log(`✅ SUCCESS! Status: ${response.status}`);
      console.log(`📊 Found ${response.data.length} books`);
      return true;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Connection refused - backend not running on this port`);
      } else if (error.code === 'ECONNABORTED') {
        console.log(`⏰ Timeout - backend not responding`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n❌ Could not connect to any backend!');
  console.log('Make sure your Spring Boot app is running on port 8080');
  return false;
}

testConnection();