# Usar una imagen base de Nginx
FROM nginx:latest

# Copiar los archivos de la aplicación web al directorio de Nginx
COPY ./html /usr/share/nginx/html

# Exponer el puerto 80 para el servidor web
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
