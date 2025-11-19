# Register user
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret", "email":"alice@example.com"}'
```

# Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username_or_email":"alice","password":"secret"}'
```
