import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return redirect(`/social-media?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return redirect("/social-media?error=no_code");
  }

  try {
    // Exchange code for tokens and save account
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/social/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      return redirect("/social-media?success=facebook_connected");
    } else {
      const errorData = await response.json();
      return redirect(`/social-media?error=${encodeURIComponent(errorData.error || "connection_failed")}`);
    }
  } catch (error) {
    console.error("Error in Facebook OAuth callback:", error);
    return redirect("/social-media?error=callback_failed");
  }
}

