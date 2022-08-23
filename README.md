## Supermarket IPS Admin
* [🌐 Web Demo](http://supermarket-ips-admin.vercel.app/)
* [Next.js](https://nextjs.org/) as the foundation
* [Mantine](https://mantine.dev/) as the design system
* [Firebase](https://firebase.google.com/)** as the backend for authentication and persistent data
* [Cloudinary](https://cloudinary.com/) for image storage


<details>
<summary>Firebase Rules</summary>
```
{
  "rules": {
    "admin_credentials": {
      ".read": "false",
    	".write": "false"
    },
    "trolley_config": {
      ".read": "auth != null",
    	".write": "auth != null"
    },
    "trolley_data": {
      ".read": "auth != null",
    	".write": "auth != null"
    },
    "trolley_past_data": {
      ".read": "auth != null",
    	".write": "auth != null",
      "$trolleyId": {
        ".indexOn": ["dateCreated"],
      }
    },
    "products": {
    	".read": "true",
      ".write": "auth.uid == root.child('admin_credentials').child('uid').val()", // admin
      ".indexOn": ["dateModified"],
    },
    "customer_chats": {
      ".read": "auth.uid == root.child('admin_credentials').child('uid').val()", // admin
      ".write": "auth.uid == root.child('admin_credentials').child('uid').val()", // admin
      "$customerId": {
        ".write": "!data.exists() && auth != null || $customerId == auth.uid",
        ".read": "auth.uid == $customerId", // Can read data if belongs to customer
        "messages":{
          "$messageId":{
            ".indexOn": ["dateCreated"],
          }
        },
      }
  	}
  }
}
```
</details>