FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY config-server/target/*.jar app.jar
COPY config-repo /app/config-repo
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
