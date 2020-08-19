start()
{
    echo starting
    nohup gunicorn -w 4 -b 0.0.0.0:3333 app:app &
}

stop()
{
    kill -9 `ps aux | grep gunicorn | awk '{print $2}'`
    sleep 1
    echo done
}

case "$1" in
  start)
      start;;
  stop)
      stop;;
  restart)
      echo "Restarting"
      $0 stop
      sleep 1
      $0 start
      ;;
  *)
      echo "use: $0 start|stop|restart"
      exit 1
      ;;

esac
