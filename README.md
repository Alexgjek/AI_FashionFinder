# Getting Started with FashionFinder

## .env Setup

Create the following environment variables:

1. MONGO_URI=your_mongoDBatlas_uri
2. OPENAI_KEY=your_openai_api_key
3. SENDGRID_API_KEY=your_sendgrid_api_key
4. EMAIL_USER=your_email
5. EMAIL_PASSWORD=your_email_password
6. DOMAIN=domain_you_will_be_running_on
7. TOKEN_SECRET=your_secret_key_for_signing_JWTs

## Dependencies

Within the fashionFinder-frontend directory, run the following command in your terminal:

```plaintext
npm install
```

Now within the Backend directory, run the following commands:
```plaintext
pip install fastapi==0.96.0 openai==0.27.8 uvicorn==0.22.0
```

## Running the Frontend and Backend servers
1. To run the frontend server, go to the fashionFinder-frontend directory and run:
```plaintext
npm run dev
```
2. To run the backend server, go to the /Backend/FashionProject/FashionProject directory and run:
```plaintext
uvicorn app:app --reload
```
