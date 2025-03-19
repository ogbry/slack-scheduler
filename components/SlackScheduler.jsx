"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SlackScheduler() {
  const [delay, setDelay] = useState(0);
  const [unit, setUnit] = useState("seconds");
  const [message, setMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [buttonText, setButtonText] = useState("Send");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const unitMultiplier =
      unit === "seconds" ? 1 : unit === "minutes" ? 60 : 3600;
    const delayInSeconds = Math.max(delay * unitMultiplier, 0);

    setButtonText(delay > 0 ? `Send in ${delay} ${unit}` : "Send");
    setIsDisabled(!(delayInSeconds > 0 && message.trim() && webhookUrl.trim()));
  }, [delay, unit, message, webhookUrl]);

  const sendMessage = async () => {
    const delayInMs = Math.max(
      delay * (unit === "seconds" ? 1 : unit === "minutes" ? 60 : 3600) * 1000,
      0
    );

    setTimeout(async () => {
      const formattedMessage = `From Bryan's Slack Bot: ${message}`;

      try {
        const response = await fetch("/api/sendMessage", {
          // Calls your Next.js API route
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: formattedMessage, webhookUrl }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to send message");

        alert("Message sent!");
      } catch (error) {
        alert("Error sending message: " + error.message);
      }
    }, delayInMs);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold">Delayed Slack Message Sender</h1>
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Enter delay"
          value={delay}
          min="0"
          onChange={(e) => setDelay(Math.max(Number(e.target.value), 0))}
        />
        <Select onValueChange={setUnit} defaultValue={unit}>
          <SelectTrigger>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Enter Slack message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter Slack webhook URL"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={sendMessage}
          disabled={isDisabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
