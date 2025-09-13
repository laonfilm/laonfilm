export const prerender = false;

export async function POST({ request, locals }) {
  try {
    const data = await request.formData();
    const email = data.get('email');
    const name = data.get('name');

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Access environment variables through Cloudflare runtime
    const apiKey = locals.runtime?.env?.SECRET_EMAILOCTOPUS_API_KEY || import.meta.env.SECRET_EMAILOCTOPUS_API_KEY;
    
    if (!apiKey) {
      console.error('EmailOctopus API key not found');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Configuration error. Please try again.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare the payload for EmailOctopus v2 API
    const payload = {
      email_address: email,
    };

    // Add name to fields if provided - use the exact merge tag from your EmailOctopus
    if (name && name.trim()) {
      payload.fields = {
        FirstName: name.trim()  // This matches your {{FirstName}} merge tag
      };
    }

    const response = await fetch(`https://api.emailoctopus.com/lists/307f20d4-85c0-11f0-9fd6-37548439d5a1/contacts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ success: true, message: 'Successfully subscribed!' }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Handle different error types more specifically
      if (response.status === 409) {
        // Already exists
        return new Response(JSON.stringify({ 
          success: true, // Show as success since they're already subscribed
          message: 'You are already subscribed to our newsletter!' 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (result.type && result.type.includes('conflict')) {
        // Also handle conflict type from API response
        return new Response(JSON.stringify({ 
          success: true, // Show as success
          message: 'You are already subscribed to our newsletter!' 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 422) {
        // Validation error
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Please enter a valid email address.' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Failed to subscribe. Please try again.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Something went wrong. Please try again.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}