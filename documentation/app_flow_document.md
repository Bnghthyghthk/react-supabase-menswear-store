# App Flow Document

## Onboarding and Sign-In/Sign-Up

A new user typically begins by arriving on the public landing page of the menswear store, where they see featured products and promotional banners. From here, they can access the sign-up page by clicking a "Create Account" button prominently placed in the header. The sign-up page presents a simple form that asks for their name, email address, and a password they choose. Form fields are validated in real time using Zod schemas, so the user immediately sees if the email format is incorrect or if the password doesn’t meet strength requirements. After submitting the form, the user receives a confirmation email with a link to verify their address. Once they click that link, they are automatically redirected to the application and signed in.

Users also have the option to sign up or sign in via social login providers. By clicking the Google or Facebook button on the sign-in page, they are taken through an OAuth flow. Once they authorize the app, they are returned to the storefront and a JWT token is stored in local storage. For returning users, the sign-in page allows them to enter their email and password, and upon successful authentication, the token is stored and the user is routed to the appropriate home page based on their role. If a user forgets their password, a "Forgot Password" link sends them to a page where they enter their email. The app sends a password reset email with a secure token. Clicking the link in that email brings the user to a reset page where they choose a new password. After resetting, they can log in with their new credentials.

Signing out is available via a button in the header menu. Clicking it clears the JWT token, resets the application state, and returns the user to the landing page.

## Main Dashboard or Home Page

After logging in, customers are directed to the store’s home page, which features a header, a category navigation bar, a search field, and a grid of featured products. The header includes links to the user’s profile, order history, cart, and a sign-out button. The category bar lets users filter products by jackets, shirts, pants, and accessories. The footer contains links to customer support, the privacy policy, and social media channels.

If the user is an admin, they are redirected to the admin dashboard instead. The admin dashboard features a sidebar with navigation links to overview, products, orders, users, and analytics sections. A top header shows the admin’s name with a sign-out button. The main area displays widgets with sales totals, pending orders, and low-stock alerts. Each widget is interactive, letting the admin click through to the corresponding detailed list view.

Users can move between sections by clicking on the navigation bar items or sidebar links. Navigations trigger client-side routing powered by React Router DOM, so transitions are smooth and quick, with Framer Motion animations enhancing page and modal openings.

## Detailed Feature Flows and Page Transitions

When a customer clicks on a product card, they are taken to the product details page. This page shows multiple images in a carousel component, a description, size options, quantity selector, and an "Add to Cart" button. Selecting size and quantity updates the form state, and clicking "Add to Cart" triggers a TanStack Query mutation to the backend API. On success, a toast notification appears and the cart icon in the header updates with the new item count.

The customer can view their cart by clicking the cart icon. The cart page lists each item with quantity controls, price totals, and a link to remove the item. Below the list, a section for promo codes lets users enter a discount code. Applying the code triggers a request that validates it and updates the total. Clicking "Proceed to Checkout" takes the user to a checkout form that collects shipping address, payment method, and billing details. Forms are built with React Hook Form and validated via Zod. After reviewing the order summary, the user clicks "Place Order," which posts to an orders endpoint. Upon success, the user sees an order confirmation page with an order number and estimated delivery date.

On the admin side, clicking "Products" in the sidebar brings up a data table of all products. The admin can click "Edit" on any row to open a modal dialog for updating product name, price, description, stock levels, and images. This dialog is a reusable Form component. Submitting the form calls a TanStack Query mutation to update the database. Successful updates close the modal, refresh the table data, and show a notification.

The "Orders" section lists each order with status badges. The admin can click on an order number to view details, update the order status via a dropdown (for example, from "Pending" to "Shipped"), and save changes. The backend returns the updated order and TanStack Query automatically updates the list.

In the "Analytics" section, the admin sees charts displaying sales over time and top-selling items. These charts are built with a Chart component and fetch data on mount. Clicking on a chart segment filters the products list in the "Products" section to those items.

## Settings and Account Management

Customers manage their personal information by clicking the profile link in the header, which opens a profile page. Here they can update their name, email, password (with current password verification), and mailing address. Saving changes triggers a backend update and displays a success message. They can also configure notification preferences by toggling email or SMS updates for promotions, order status changes, and restock alerts.

Admins have a similar account settings page accessible via the profile icon in the dashboard header. They can update their profile details and switch their password. If the admin’s account is linked to a billing subscription for premium analytics features, a "Billing" tab shows current plan details, next invoice date, and a button to update payment information. Changes here open a secure payment modal connected to a payment provider.

After updating settings or billing details, users can return to the main dashboard or storefront by clicking the logo in the header, which serves as a home link.

## Error States and Alternate Paths

If a user attempts to submit invalid data—such as leaving required fields blank or entering an incorrectly formatted email—the form highlights the invalid fields in red and shows inline error messages powered by Zod. If a network request fails due to connectivity issues, a full-screen error banner appears at the top with a message like "Network error. Please check your connection and try again." A "Retry" button reattempts the last request.

Unauthorized access to admin routes is guarded by a role check in the route definitions. If a non-admin user tries to navigate to "/admin", they are redirected to the storefront with an alert stating "Access denied." Likewise, if a session expires or the JWT is invalid, the user is signed out and sent back to the login page with a message "Session expired. Please sign in again."

A catch-all 404 page appears if the user navigates to an undefined route. It displays a friendly message and a link back to the home page.

## Conclusion and Overall App Journey

In summary, from the moment a customer lands on the store’s public page, they can effortlessly create an account, browse products, and place orders through clear, intuitive pages and forms. Their shopping journey moves seamlessly from product discovery to checkout confirmation. Admins enjoy a dedicated dashboard that gives them full control over products, orders, users, and analytics. Error conditions are handled gracefully, guiding users back into a normal flow. Throughout everyday usage, users can update settings, sign in and out easily, and rely on real-time feedback and animations for a polished and professional experience.