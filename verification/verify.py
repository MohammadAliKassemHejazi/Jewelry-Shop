from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Intercept and abort api calls to prevent redirect
        page.route("**/api/auth/session", lambda route: route.abort())
        page.route("**/api/cart/count", lambda route: route.abort())
        page.route("**/api/favorites/count", lambda route: route.abort())

        try:
            print("Navigating to http://localhost:3003...")
            page.goto("http://localhost:3003", wait_until="networkidle")
            page.wait_for_timeout(2000) # Give it a moment to render

            # Take screenshot of English homepage
            page.screenshot(path="verification/homepage_en_2.png", full_page=True)
            print("Saved English homepage screenshot to verification/homepage_en_2.png")

            # Click language toggle to Arabic
            lang_button = page.locator("button:has-text('EN')")
            if lang_button.is_visible():
                lang_button.click()
                page.wait_for_timeout(2000)
                page.screenshot(path="verification/homepage_ar.png", full_page=True)
                print("Saved Arabic homepage screenshot to verification/homepage_ar.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error.png", full_page=True)
            print("Saved error screenshot to verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    verify()
