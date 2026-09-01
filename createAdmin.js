const data = {
  name: "Super Admin",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "password123",
  role: "admin"
};

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
