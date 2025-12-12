"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function ServiceWorkerRegister() {
    useEffect(() => {
        async function registerAndSubscribe() {
            if (
                "serviceWorker" in navigator &&
                "PushManager" in window &&
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            ) {
                try {
                    const registration = await navigator.serviceWorker.register("/sw.js");
                    console.log(
                        "Service Worker registered with scope:",
                        registration.scope
                    );

                    // Wait for service worker to be active
                    await navigator.serviceWorker.ready;

                    // Check if user is logged in (has token) before asking for subscription
                    // This is a rough check; ideally we handle this via AuthContext, 
                    // but this component is in layout.
                    const token = getCookie("token");
                    if (!token) return;

                    const subscription = await registration.pushManager.getSubscription();

                    if (!subscription) {
                        // Logic to ask for permission could go here, or we proactively ask
                        // For this task, we'll try to subscribe if not denied
                        if (Notification.permission !== 'denied') {
                            const newSubscription = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(
                                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                                ),
                            });

                            // Send to backend
                            await fetch("/api/notifications/subscribe", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(newSubscription),
                            });
                            console.log("Subscribed to push notifications");
                        }
                    }
                } catch (error) {
                    console.error("Service Worker/Push registration failed:", error);
                }
            }
        }

        registerAndSubscribe();
    }, []);

    return null;
}
