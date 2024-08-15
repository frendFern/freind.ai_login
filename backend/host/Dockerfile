FROM python:3.9

COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir --upgrade -r /requirements.txt

ADD app/ /app/
RUN ls --recursive /app

RUN wget -O /app/checkpoints.zip https://myshell-public-repo-hosting.s3.amazonaws.com/checkpoints_1226.zip && unzip /app/checkpoints.zip -d /app/ && rm /app/checkpoints.zip
RUN ls --recursive /app

WORKDIR /app

RUN apt-get -y update
RUN apt-get install -y ffmpeg

CMD ["python", "host.py", "--host", "0.0.0.0", "--port", "6002"]