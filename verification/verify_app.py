from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_frontend(page: Page):
    # 1. Navigate to Home
    page.goto("http://localhost:3000")
    # Wait for the page to load content
    page.wait_for_timeout(5000)

    # Check for critical elements - using more specific selector
    expect(page.get_by_role("heading", name="Elegant Jewelry")).to_be_visible()

    # Take screenshot of home
    page.screenshot(path="/home/jules/verification/home.png")

    # 2. Navigate to Shop
    # Use first to avoid strict mode violation if multiple Shop links (e.g. header and footer)
    page.get_by_role("link", name="Shop").first.click()
    page.wait_for_timeout(5000)
    expect(page.get_by_text("Our Collection")).to_be_visible()

    # Take screenshot of shop
    page.screenshot(path="/home/jules/verification/shop.png")

    # 4. Navigate to Cart (empty state)
    page.goto("http://localhost:3000/cart")
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/cart.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_frontend(page)
            print("Verification script ran successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()
