# 📊 Quid Grade Calculator

A browser extension that automatically scrapes, calculates, and projects your academic grades from the Quid platform, giving you a clear and actionable overview of your performance.


## Main Features

*   **Automatic Grade Scraping:** Navigates the Quid student dashboard in the background to pull all your Period 4 grades and activity details.
*   **Advanced Grade Analytics:** For each subject, the extension calculates and displays:
    *   **`Current Grade`**: Your weighted average based on completed activities.
    *   **`Worst Case Scenario`**: Your projected final grade if you score zero on all remaining activities.
    *   **`Remaining Percentage`**: The percentage of the course grade that is still pending.
    *   **`Grade Needed to Pass`**: The average grade you need on remaining activities to achieve a final score of 3.5. The color changes to red if the required grade is above 5.0.
*   **Overall GPA:** Calculates and displays your general GPA for the period based on all subjects with available grades.
*   **Intuitive & Clean UI:** A simple, color-coded interface provides an at-a-glance overview of your academic standing.
*   **One-Click Refresh:** A dedicated button to instantly re-scrape the data and update your calculations.

## The Development Story

This project was born from a simple need: to answer the questions every student has but the platform doesn't. "What's my real grade right now?", "What happens if I fail the final exam?", and most importantly, "**What do I need to pass?**"

The goal was to create a tool that not only displays data but provides intelligence. I focused on building a "client-side" solution that lives entirely in the browser, ensuring user privacy and speed. The development process was a deep dive into the architecture of modern web applications and the tools needed to interact with them programmatically.

The key challenge was reverse-engineering the Quid dashboard's structure to parse the grades reliably. This involved navigating through modals and dynamically loaded content, which required a clear separation between the content script (the data scraper) and the popup script (the UI). This architecture ensures the extension is both robust and efficient.

## Technologies Used

*   **JavaScript:**
    *   **DOM Manipulation:** Programmatically navigating the Quid dashboard to find and extract grade information from specific tables, buttons, and modals.
    *   **Chrome Extension APIs:** Using `chrome.storage.local` for data persistence between the content script and the popup, and `chrome.tabs.sendMessage` for communication between them.
*   **HTML5 / CSS3:** Building a clean, modern, and responsive popup interface for clear data visualization.
*   **Manifest V3:** The current standard for Chrome extension development.

## Key Takeaway

This project reinforced a critical lesson: **the most powerful tools are often those that translate raw data into actionable insight.** It's not enough to just show numbers; the value lies in calculating what those numbers *mean* for the user. Technically, it was an excellent exercise in the separation of concerns within a browser extension, highlighting the importance of a well-defined boundary between the data collection logic (`content.js`) and the user-facing presentation layer (`popup.js`). The result is a stable, useful tool that solves a real-world problem I and many other students face.
