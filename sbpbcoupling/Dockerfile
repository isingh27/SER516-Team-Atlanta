FROM python:3.11

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5008

ENV FASTAPI_APP=main.py

CMD ["uvicorn", "main:app","--host","0.0.0.0", "--port", "5008"]