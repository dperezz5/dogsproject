# DogSwipe Application Specification

This document outlines the complete specification for DogSwipe, a Tinder-style web application for dog owners. DogSwipe enables users to create dog profiles, swipe on nearby dogs, match mutually interested profiles, and communicate with one another. User authentication is handled via Firebase.

---

## 1. Project Overview

**Purpose:**  
DogSwipe is designed for dog owners to connect with nearby pet profiles via a swipe-driven interface. Profiles can be created, browsed, and matched in a secure and scalable manner.

**Core Features:**
- User registration and authentication with Firebase.
- Dog profile creation and management (including images, description, breed, age, gender, favourite activities,  etc.).
- Geolocation-based discovery of nearby dog profiles.
- Swipe interactions (left to pass, right to like).
- Match logic to trigger notifications upon mutual interest.
- Optional messaging or exchange of contact details post-match.

**Target Users:**  
Dog owners seeking to connect with other local pet owners for playdates and social interactions.

---

## 2. Functional Requirements

### 2.1. User Management (via Firebase)

- **User Registration & Login:**
  - **Firebase Authentication:**  
    Users register and log in using Firebase Authentication (supports email/password and social logins such as Google and Facebook).
  - **SDK Integration:**
    - **Frontend:**  
      Utilize the Firebase SDK to handle authentication, session persistence, and user management.
    - **Backend:**  
      Every API call must include a Firebase-issued ID Token; the backend validates these tokens using the Firebase Admin SDK.
  - **Password Recovery & Account Verification:**  
    Firebase's built-in workflows for password resets and account verification are used.

- **User Profile Management:**
  - Each user can have one or more associated dog profiles.
  - Users can update or delete their own profile information.
  - Firebase manages credentials to simplify backend logic regarding sensitive data.

### 2.2. Dog Profile Management

- **Creation & Editing:**
  - Input fields include: Name, Age, Breed, Gender, Location (auto-detected via geolocation or manually entered), a short description, and multiple image uploads, gender, favourite activities and age.
  - Client-side validation for image file type/size and text fields.
  
- **Display:**
  - Dog profiles are shown as cards in a swipe interface, highlighting key details like the dog's picture, name, breed, and age.

- **Deletion:**
  - Dog owners can delete the profile of their dog as needed.

### 2.3. Discovery & Swiping

- **Geolocation-Based Filtering:**
  - Use the HTML5 Geolocation API to detect the user's current location.
  - Query the backend for dog profiles within a configurable radius.

- **Swipe Actions:**
  - **Swipe Right (Like):** Indicates interest in the dog profile.
  - **Swipe Left (Pass):** Indicates no interest.
  - All swipe actions are recorded for later match analysis.

- **Match Logic:**
  - A match occurs when two dog profiles mutually swipe right.
  - Users receive notifications of a successful match.

### 2.4. Matching & Engagement

- **Match List:**
  - Display a list or section with all matched dog profiles.
  
- **Messaging/Contact:**
  - Optionally, after matching, provide a basic chat interface or contact details exchange to facilitate communication between pet owners.

### 2.5. Notifications

- **Real-Time Notifications:**
  - In-app notifications (e.g., toast messages or modal alerts) upon a match.
  - Optional browser push notifications for mobile and desktop.
  
- **Email Alerts:**
  - Optionally, send emails for account verification, match notifications, or important app updates.

### 2.6. Administration & Moderation

- **Admin Dashboard:**
  - Interface for administrators to manage user reports, moderate inappropriate content, and perform CRUD operations on profiles.
  
- **Reporting & Flagging:**
  - Allow users to report profiles or images they find inappropriate.

---

## 3. Non-Functional Requirements

### 3.1. Performance and Scalability
- The system should support high volumes of swipes and profile views.
- Optimize geolocation queries and image delivery (e.g., via a CDN).

### 3.2. Security
- Use HTTPS for secure communication across the application.
- Validate every Firebase ID Token on the backend using the Firebase Admin SDK.
- Implement rate limiting on critical API endpoints.
- Sanitize all user inputs to prevent SQL injection and cross-site scripting (XSS) attacks.

### 3.3. Usability
- Implement a mobile-first responsive design for seamless use on smartphones and desktops.
- Ensure smooth and intuitive swipe interactions with appropriate animations.
- Optimize load times and front-end rendering using React best practices.

### 3.4. Maintainability & Extensibility
- Use modular coding practices for both frontend and backend.
- Separate business logic from UI code.
- Provide extensive unit and integration tests.
- Plan for API versioning to support future enhancements.

### 3.5. Availability & Reliability
- Design the architecture for high availability (using load balancing and horizontal scaling).
- Implement regular backups of user data and profiles.
- Continuously monitor system performance using tools like Prometheus, Grafana, or similar.

---

## 4. Technology Stack

### 4.1. Frontend
- **Framework:** React
- **Routing:** React Router for SPA navigation.
- **State Management:** Context API or Redux (depending on the application scale).
- **Styling:** CSS Modules, Styled Components, or an equivalent system.
- **Animations:** Use libraries like Framer Motion for fluid swipe transitions.
- **Geolocation API:** Native HTML5 Geolocation API.
- **Firebase Integration:**  
  Use the Firebase SDK for authentication, and optionally for real-time database features.

### 4.2. Backend
- **Language & Framework:** Node.js with Express (or similar).
- **Authentication:**
  - Use Firebase Authentication with backend validation via Firebase Admin SDK.
- **Database Options:**
  - **NoSQL (e.g., MongoDB):** For flexible, dynamic data models.
  - **Relational (e.g., PostgreSQL):** For applications requiring strict schema adherence.
- **Image Storage:** AWS S3 or a similar cloud storage provider.
- **Geolocation Queries:** Leverage native geospatial indexing capabilities for location-based queries.

### 4.3. DevOps & Deployment
- **Containerization:** Docker to standardize the development and deployment environment.
- **CI/CD:** Utilize Git-based pipelines with automated tests (using GitHub Actions, Jenkins, etc.).
- **Cloud Hosting:** Deploy to a single cloud platform such as AWS, Heroku, or equivalent.
- **Monitoring:** Implement logging and system monitoring with tools like Prometheus, Grafana, or managed services.

---

## 5. Data Models

### 5.1. User Model

```json
{
  "id": "UUID",
  "username": "string",
  "email": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "dogProfiles": ["DogProfile.id", ...],
  "gender": "string",
  "age": "number"
}
```
Note: Password management is handled by Firebase Authentication.

### 5.2. Dog Profile Model
```json
{
  "id": "UUID",
  "ownerId": "User.id",
  "name": "string",
  "breed": "string",
  "age": "number",
  "gender": "string",
  "size": "string",               // e.g., "small", "medium", "large"
  "weight": "number",             // Weight in kg or lbs
  "description": "string",
  "temperament": "string",        // e.g., "friendly", "shy", "energetic"
  "vaccinationStatus": {
    "rabies": "boolean",
    "distemper": "boolean",
    "otherVaccines": ["string"]
  },
  "neutered": "boolean",          // Indicates if the dog is neutered/spayed
  "exerciseNeeds": "string",      // e.g., "low", "medium", "high"
  "favoriteActivities": ["string"],  // e.g., "fetch", "running", "swimming"
  "healthHistory": {
    "allergies": ["string"],
    "chronicConditions": ["string"],
    "recentProcedures": ["string"]
  },
  "trainingLevel": "string",      // e.g., "basic", "intermediate", "advanced"
  "images": ["string"],           // URLs for the dog's images
  "averageRating": "number",      // Average star rating (0 to 5) calculated from reviews
  "ratingCount": "number",        // Total number of ratings received
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}


```

### 5.3. Swipe & Match Models
Swipe Record:

```json
{
  "id": "UUID",
  "swiperId": "DogProfile.id",
  "swipedId": "DogProfile.id",
  "swipeType": "enum('like', 'pass')",
  "timestamp": "timestamp"
}
```

Match Record:

```json
{
  "id": "UUID",
  "dogProfile1": "DogProfile.id",
  "dogProfile2": "DogProfile.id",
  "matchedAt": "timestamp",
  "isActive": "boolean"
}
```

```json
{
  "id": "UUID",
  "matchId": "Match.id",         // The associated match for which the review is given
  "reviewerId": "User.id",       // The ID of the user providing the review
  "revieweeId": "User.id",       // The ID of the user being reviewed
  "rating": "number",            // Star rating from 0 to 5
  "comment": "string",           // Optional textual feedback
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 6. API Endpoints

### 6.1. User Endpoints
Registration & Login:
Handled on the frontend with Firebase Authentication.

Flow:
- User signs up or logs in via the Firebase SDK.
- Firebase returns an ID Token.
- The token is included in the `Authorization: Bearer <token>` header for every API request.
- The backend validates the token using the Firebase Admin SDK.

User Profile Management:
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### 6.2. Dog Profile Endpoints
Create Dog Profile:
- POST /api/dogs

Payload Example:
```json
{
  "ownerId": "User.id",
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "male",
  "description": "Friendly and active",
  "images": ["https://example.com/path/to/image1.jpg"],
  "location": {
      "longitude": -73.935242,
      "latitude": 40.730610
  }
}
```

Retrieve Dog Profiles:
- GET /api/dogs (Supports query parameters for location, radius, and pagination)
- GET /api/dogs/:id

Update & Delete Dog Profile:
- PUT /api/dogs/:id
- DELETE /api/dogs/:id

### 6.3. Swipe and Match Endpoints
Record a Swipe:
- POST /api/swipes

Payload Example:
```json
{
  "swiperId": "DogProfile.id",
  "swipedId": "DogProfile.id",
  "swipeType": "like"  // or "pass"
}
```

Logic:
- Check for an existing reciprocal "like".
- If both profiles have liked each other, create a match record and trigger notifications.

Fetch Matches:
- GET /api/matches?ownerId=User.id

Response: A list of match objects with corresponding dog profile details.

---

## 7. UI/UX Design

### 7.1. Layout & Navigation
Landing/Home Page:
- Overview of the application with clear call-to-action buttons for login/registration (integrated with Firebase).

Dashboard:
- Displays user profile details, the swipe interface, and navigation to "Discover," "Matches," and "Profile Settings."

Swipe Screen:
- Full-screen card view of dog profile information.
- Supports touch gestures for swiping on mobile and clickable controls on desktop.

Matches & Messaging:
- Dedicated section to display matches.
- Optional basic chat or contact exchange interface.

### 7.2. Component Breakdown (React)
Authentication Components:
- Login, Register, and Password Reset forms integrated with Firebase.

Profile Components:
- Dog Profile Creation Form, Dog Card Component, and Profile Edit Form.

Discovery Components:
- Swipe Card Component, geolocation utility functions, and matches list.

Notification Components:
- Toasts or modals for match alerts and error messages.

State Management:
- Use Context API or Redux to manage authentication state, swipe history, and active matches.

### 7.3. Responsiveness & Accessibility
- Implement mobile-first design.
- Use semantic HTML elements and ARIA attributes for better accessibility.
- Ensure the layout adapts well across different screen sizes and orientations.

---

## 8. Testing & Quality Assurance

### 8.1. Unit Testing
Frontend:
- Use Jest and React Testing Library to test components and Firebase integrations.

Backend:
- Use Jest or Mocha/Chai to test API endpoints, business logic, and token validation.

### 8.2. Integration & End-to-End (E2E) Testing
- Simulate user flows (registration, login, swiping, matching) using tools like Cypress or Selenium.
- Specific tests for geolocation functionality, Firebase token verification, and API security.

### 8.3. Performance Testing
- Simulate high-traffic scenarios (many swipes and profile views) to measure API and front-end performance.
- Benchmark load times and responsiveness under stress.

---

## 9. Deployment & Maintenance

### 9.1. Deployment Pipeline
Version Control:
- Use Git with feature branches, pull requests, and code reviews.

CI/CD:
- Automated pipelines (using GitHub Actions, Jenkins, etc.) that run tests, linters, and build scripts on every commit.

Containerization:
- Use Docker to ensure consistent environments from development to production.

Staging Environment:
- Validate builds in a staging area before releasing to production.

### 9.2. Monitoring & Backups
Monitoring:
- Use logging (e.g., Winston or Morgan) and monitoring tools like Prometheus/Grafana.

Backups:
- Regularly backup user data, profiles, and databases.

Firebase:
- Leverage Firebase's own monitoring and analytics as needed.

### 9.3. Future Enhancements
- Expand messaging features (e.g., support for media attachments).
- Improve the matching algorithm with additional factors (breed, activity level, interests).
- Integrate social sharing and external pet community features.
- Consider in-app purchases for premium services like profile boosts.


---

## 10. Environment Strategy
To ensure stability, continuous improvement, and proper version control, DogSwipe will use a multi-environment deployment strategy.

### 11.0. Development Environment
Purpose:
The development (dev) environment is where new features and bug fixes are implemented and initially tested by developers.

Configuration & Tools:

- Local Development:
  - Developers work on feature branches using local servers with hot-reload enabled.

- Firebase:
  - Use a dedicated Firebase project or configuration for development to keep data and security credentials isolated.

- Backend & Database:
  - Use local instances or Docker containers for the backend and database to iterate quickly.

- Version Control:
  - Code is maintained on Git feature branches and merged into a main development branch after peer reviews.

- CI/CD Integration:
  - Automated builds and tests run on every commit (using GitHub Actions, Jenkins, etc.).

### 10.2. Test Environment
Purpose:
The test environment is used for running automated integration, unit, and performance tests in a controlled, production-like setting.

Configuration & Tools:

- Staging Databases:
  - Use replica or dummy data sets for testing database operations in an isolated environment.

- Continuous Integration:
  - Merge feature branches into a dedicated test branch, triggering CI/CD pipelines that deploy code to the test environment.

- Automated Testing:
  - Execute integration, end-to-end, and regression tests before broader release.

- Firebase:
  - Use a dedicated Firebase project configured for testing to prevent data and configuration clashes with production.

### 10.3. Pre-Production Environment
Purpose:
The pre-production (staging) environment closely mirrors production. It is used for final testing, user acceptance testing (UAT), and performance benchmarks before release.

Configuration & Tools:

- Mirror Production Setup:
  - Duplicate production configurations, including similar resources, third-party integrations, and security settings.

- User Acceptance Testing (UAT):
  - Conduct manual and automated UAT, security audits, and performance tests in this environment.

- Version Control:
  - Code passing the test environment is merged into the pre-production branch. Final approval follows smoke testing and UAT feedback.

- Firebase:
  - Maintain a pre-production Firebase project matching production settings to validate authentication and other integrations.

- Release Candidate:
  - The pre-production deployment is the release candidate; once approved, it goes live to production.

### 10.4. Deployment Pipeline Summary
Version Control Branches:

- Development Branch: For active development and initial testing.

- Test Branch: For code that has passed local testing and now undergoes CI testing.

- Pre-Production Branch: For final UAT and smoke testing before production.

- Production Branch: For code that is fully approved and deployed to live users.

CI/CD Integration:
- Automated pipelines build, test, and deploy code based on merges and commits.

Configuration Management:
- Use separate configuration files for each environment (including Firebase credentials, API endpoints, and database connections) to ensure complete isolation. 

---

## 11. Summary
DogSwipe is built as a scalable and user-friendly web application. Using Firebase for secure authentication combined with a React frontend and Node.js backend, DogSwipe provides an engaging experience for dog owners to connect with local pet profiles. This specification serves as a comprehensive guide for development, testing, and deployment.