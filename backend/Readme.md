```bash
python -m venv venv
```

```bash
source venv/bin/activate
or
.\venv\Scripts\activate
```

```bash
pip install -r requirements.txt
```

Create .env file:

```bash
DATABASE_URL="postgresql://user:password@localhost/dbname"
```

```bash
python create_tables.py
```

```bash
python load_data.py
```

Run the server:

```bash
uvicorn main:app --reload
```