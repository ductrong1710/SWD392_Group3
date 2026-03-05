# ========== BUILD STAGE: Biên dịch code Java thành file .jar ==========
# Sử dụng image chứa sẵn Maven và Java 21 (JDK) để build dự án
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Tối ưu cache: Copy pom.xml trước để tải các thư viện (dependencies)
# Nếu các thư viện không thay đổi, Docker sẽ dùng lại cache ở bước này
COPY pom.xml .
RUN mvn dependency:go-offline

# Bây giờ mới copy toàn bộ source code của bạn vào
COPY src ./src

# Build ứng dụng thành file .jar, bỏ qua test để build nhanh hơn trên server
RUN mvn clean package -DskipTests

# ========== RUN STAGE: Chạy ứng dụng trong một môi trường siêu nhẹ ==========
# Sử dụng image chỉ chứa Java 21 JRE (nhẹ hơn nhiều so với JDK)
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file .jar đã được build từ stage trên vào stage này
# Ký tự * đại diện cho tên và phiên bản của project, giúp file linh hoạt hơn
COPY --from=build /app/target/*.jar app.jar

# "Mở" cổng 8080 để Render có thể gửi request vào ứng dụng của bạn
EXPOSE 8080

# Lệnh để khởi động ứng dụng Spring Boot của bạn khi container chạy
ENTRYPOINT ["java", "-jar", "app.jar"]