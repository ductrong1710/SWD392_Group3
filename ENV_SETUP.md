# Environment Variables Setup Guide

## Overview
This application uses environment variables to securely store sensitive configuration like API keys and secrets.

## Setup Instructions

### 1. Create Environment File
Copy the example file and fill in your actual values:
```bash
cp .env.example .env
```

### 2. Fill in Required Values

Edit `.env` file and replace placeholders with your actual credentials:

```env
# JWT Configuration
JWT_SECRET_KEY=your-actual-secret-key-minimum-256-bits
JWT_EXPIRATION=86400000

# VNPay Configuration  
VNPAY_TMN_CODE=your-vnpay-terminal-code
VNPAY_SECRET_KEY=your-vnpay-secret-key

# AI/Groq Configuration
GROQ_API_KEY=your-groq-api-key

# HuggingFace Configuration
HUGGINGFACE_TOKEN=your-huggingface-token
```

### 3. Load Environment Variables

#### Option A: Using Spring Boot (Recommended)
Spring Boot automatically reads from environment variables. No additional configuration needed.

#### Option B: Using .env file with spring-dotenv
Add dependency to `pom.xml`:
```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

#### Option C: Set System Environment Variables
**Windows:**
```cmd
setx GROQ_API_KEY "your-key"
setx HUGGINGFACE_TOKEN "your-token"
```

**Linux/Mac:**
```bash
export GROQ_API_KEY="your-key"
export HUGGINGFACE_TOKEN="your-token"
```

### 4. Run Application
```bash
cd BackEnd
mvn spring-boot:run
```

## Getting API Keys

### Groq API Key
1. Visit https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key

### HuggingFace Token
1. Visit https://huggingface.co/settings/tokens
2. Sign up or log in  
3. Create new token with read access

### VNPay Credentials
1. Register merchant account at https://vnpay.vn
2. Get TMN Code and Secret Key from dashboard

## Security Notes

⚠️ **NEVER commit `.env` file to version control!**
- `.env` is already in `.gitignore`
- Always use `.env.example` for templates
- Rotate keys if accidentally exposed

## Troubleshooting

### Application fails to start
- Check if all required environment variables are set
- Verify no typos in variable names (use UPPERCASE with underscores)
- Ensure values don't have quotes unless needed

### API calls fail
- Verify API keys are valid and not expired
- Check network connectivity
- Review application logs for detailed error messages
