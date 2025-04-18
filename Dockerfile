FROM eclipse-temurin:17-jdk as build

WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY ./library/mvnw ./library/mvnw.cmd ./
COPY ./library/.mvn ./.mvn
COPY ./library/pom.xml ./

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY ./library/src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
