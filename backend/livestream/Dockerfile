FROM python:3.9

COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir --upgrade -r /requirements.txt

COPY keepalive.py /keepalive.py
COPY livestream-yt.py /livestream-yt.py

RUN apt-get update
RUN apt-get install -y python3

CMD ["python", "keepalive.py", "--host", "0.0.0.0"]