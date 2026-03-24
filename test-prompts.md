# Test Prompts for ChatFlow AI SaaS

## 1. Chatbot Responses
- **Prompt**: "Who are you and what can you do?"
- **Expected**: The chatbot should respond based on the personality and behavior rules defined in the builder.

## 2. Knowledge Base Usage
- **Action**: Upload a PDF or scrape a URL (e.g., your company's about page).
- **Prompt**: "What is the mission of [Your Company]?"
- **Expected**: The AI should use the uploaded/scraped content to answer accurately.

## 3. Payment Flow
- **Action**: Go to the Billing page and click "Upgrade".
- **Expected**: A toast message should appear indicating redirection to Stripe (in demo mode).

## 4. Subscription Limits
- **Action**: Try to create more chatbots than allowed by the plan (e.g., more than 1 on the Starter plan).
- **Expected**: The app should prevent creation and prompt for an upgrade.

## 5. Integrations
- **Action**: Copy the widget script and paste it into a simple HTML file.
- **Expected**: The chat bubble should appear and allow interaction with the chatbot.
