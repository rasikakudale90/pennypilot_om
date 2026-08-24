# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml* backend/pom.xml* ./
COPY src* ./src
COPY backend/src* ./src

# Build package with automatic retry handler to avoid Maven Central rate limits (429)
RUN mvn -B clean package -DskipTests -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.http.retryHandler.requestSentEnabled=true

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
