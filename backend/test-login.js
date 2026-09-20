async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'testpassword' })
    });
    const data = await res.json();
    console.log({ status: res.status, data });
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
