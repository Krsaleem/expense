python -m venv venv
venv\Scripts\activate
D:\Projects\expense\env\Scripts\activate
cd D:\Projects\expense\backend\src
uvicorn main:app --reload

pip install fastapi uvicorn sqlalchemy asyncpg passlib[bcrypt] python-jose
pip list
	Package           Version
----------------- -------
annotated-types   0.7.0
anyio             4.10.0
asyncpg           0.30.0
bcrypt            4.3.0
click             8.3.0
colorama          0.4.6
ecdsa             0.19.1
fastapi           0.117.1
greenlet          3.2.4
h11               0.16.0
idna              3.10
passlib           1.7.4
pip               25.1.1
pyasn1            0.6.1
pydantic          2.11.9
pydantic_core     2.33.2
python-jose       3.5.0
rsa               4.9.1
six               1.17.0
sniffio           1.3.1
SQLAlchemy        2.0.43
starlette         0.48.0
typing_extensions 4.15.0
typing-inspection 0.4.1
uvicorn           0.36.0

https://www.postgresql.org/download/windows/
netstat -a -n | findstr 5432


Fronend 

pnpm create vite frontend
pnpm install
pnpm remove tailwindcss postcss autoprefixer
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p
pnpm add react-router-dom

pnpm dev