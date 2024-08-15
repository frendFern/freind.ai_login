FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

RUN curl -fsSL https://ollama.com/install.sh | sh
RUN ollama serve
RUN ollama pull llama3

CMD ["python", "./app/ollama.py", "--host", "0.0.0.0", "--port", "6003"]