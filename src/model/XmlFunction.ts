import fs from 'fs';
import xml2js,{ parseString,parseStringPromise,Builder } from 'xml2js';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password: string;
}


// Function to get the ID of the last user from the XML file
export const getLastUserId = (filePath: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Read the existing XML file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading the XML file:", err);
        return reject(err); // Reject the Promise if there's an error
      }

      // Parse the XML data
      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return reject(err); // Reject the Promise if there's an error
        }

        // Access the users and get the last user
        const users = result.users.user; // Access the user array
        if (users && users.length > 0) {
          const lastUser = users[users.length - 1]; // Get the last user
          const lastUserId = lastUser.$.id; // Access the ID attribute
          resolve(lastUserId); // Resolve the Promise with the last user ID
        } else {
          console.log("No users found in the file.");
          resolve(null); // Resolve with null if no users found
        }
      });
    });
  });
};



export const checkEmailExists = async (emailToFind: string): Promise<boolean> => {
    try {
        // Read the XML file
        const xmlData = fs.readFileSync('./src/data/data.xml', 'utf8');
        
        // Parse XML into a JavaScript object
        const result = await parseStringPromise(xmlData);

        // Extract users
        const users = result.users.user;

        // Search for the email
        const emailExists = users.some((user: any) => user.email[0] === emailToFind);

        return emailExists;
    } catch (err) {
        console.error("Error reading or parsing the XML file:", err);
        return false;
    }
};





export const addUser = async (newUser: User): Promise<void> => {
    try {
        // Step 1: Read existing XML data
        const xmlData = fs.readFileSync('./src/data/data.xml', 'utf8');
        
        // Step 2: Parse XML data into a JavaScript object
        const result = await parseStringPromise(xmlData);
        const date=new Date();
        // Step 3: Add new user to the existing users array
        const usersArray = result.users.user || []; // Get current users or an empty array if none
        usersArray.push({
          $: { id: newUser.id, type: 'user' }, // Adds the ID as an attribute of <user> and specifies type
          date: [{ $: { d: date } }], // Sets <date d="value"/>
          email: [{ _: newUser.email }], // Wraps email in an array and adds as element value
          password: [{ _: newUser.password }] // Wraps password in an array and adds as element value
        });
      
      

        // Step 4: Update the users array in the parsed object
        result.users.user = usersArray;

        // Step 5: Convert the updated object back to XML
        const builder = new Builder();
        const updatedXmlData = builder.buildObject(result);

        // Step 6: Write the updated XML data back to the file
        fs.writeFileSync('./src/data/data.xml', updatedXmlData, 'utf8');
        
        console.log("New user added successfully!");

    } catch (err) {
        console.error("Error adding new user:", err);
    }
};

export interface User {
  id: string;        // User ID as a string
  email: string;     // User's email
  password: string;  // User's password (hashed)
  date?: string;     // Optional property for date or any other fields
}


// Function to get a user by email from the XML file
export const getUserByEmail = async (email: string): Promise<User> => {
    const parser = new xml2js.Parser();
    const xmlFilePath = './src/data/data.xml'; // Adjust the path to your XML file

    try {
        // Read the XML file
        const xmlData = await fs.promises.readFile(xmlFilePath, 'utf8');
        
        // Parse the XML data
        const result = await parser.parseStringPromise(xmlData);
        const users = result.users.user;

        // Find the user by email
        const user = users.find((u: any) => u.email[0] === email); // Accessing email as it's in an array

        return user ? user : null; // Return the user object or null if not found
    } catch (error) {
        console.error('Error reading XML file:', error);
        throw new Error('Unable to fetch user data');
    }
};




export const getAllUsers = async (): Promise<User[]> => {
  try {
      // Read the XML file
      const data = await fs.promises.readFile('./src/data/data.xml', 'utf8');
      
      // Parse the XML data
      const result = await parseStringPromise(data);

      // Check if `users` and `user` elements exist
      const users = result?.users?.user || [];

      // Map the parsed users to the User type
      const userList: User[] = users.map((user: any) => ({
          id: user?.$?.id || '', // Access the ID attribute safely
          email: user?.email?.[0] || '', // Check if email exists and get first element
          password: user?.passworld?.[0] || '', // Check if password exists and get first element
          date: user?.date?.[0]?.$?.d || '' // Access date safely, if available
      }));

      return userList; // Return the array of users
  } catch (error) {
      console.error("Error reading or parsing the XML file:", error);
      throw error; // Re-throw the error after logging
  }
};



// Function to change user by email
export async function changeUserByEmail(email: string, newPassword: string): Promise<number> {
    try {
        // Read the XML file
        const xmlData = await fs.promises.readFile('./src/data/data.xml', 'utf-8');

        // Parse the XML data
        const result = await parseStringPromise(xmlData);
        const saltRounds: number = parseInt(process.env.TYPE_APP_SALTROUNDS || "10", 10);
        // Find the user by email
        let userFound = false;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        result.users.user.forEach((user: any) => {
            if (user.email[0] === email) {
                // Update the user's password
                user.password[0] = hashedPassword; // Change the password
                userFound = true;
            }
        });

        if (!userFound) {
            console.log('User not found.');
            return -1;
        }

        // Build the updated XML
        const builder = new Builder();
        const updatedXml = builder.buildObject(result);

        // Write the updated XML back to the file
        await fs.promises.writeFile('./src/data/data.xml', updatedXml);
        console.log('User updated successfully.');
        return 1;

    } catch (error) {
        console.error('Error updating user:', error);
        return 0;
    }
}

// Example usage
// changeUserByEmail('hmarwanf130@gmail.com', 'new_password@123');
