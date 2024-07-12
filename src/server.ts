import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({
      error: "Email or Phone Number is required.",
    });
  }

  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (existingContacts.length == 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [email].filter(Boolean),
        phoneNumbers: [phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      },
    });
  }

  let primaryContact = existingContacts.find(
    (contact) => contact.linkPrecedence === "primary"
  );
  if (!primaryContact) {
    primaryContact = existingContacts[0];
    primaryContact = await prisma.contact.update({
      where: {
        id: primaryContact.id,
      },
      data: {
        linkPrecedence: "primary",
      },
    });
  }

  const secondaryContacts = existingContacts.filter(
    (contact) => contact.id !== primaryContact.id
  );
  for (const contact of secondaryContacts) {
    if (contact.linkPrecedence === "primary") {
      await prisma.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        },
      });
    }
  }

  const existingContactWithEmail = existingContacts.find(
    (contact) => contact.email === email
  );
  const existingContactWithPhoneNumber = existingContacts.find(
    (contact) => contact.phoneNumber === phoneNumber
  );
  if (!existingContactWithEmail || !existingContactWithPhoneNumber) {
    const newSecondaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });
    secondaryContacts.push(newSecondaryContact);
  }

  const emails = Array.from(
    new Set([
      primaryContact.email,
      ...secondaryContacts.map((contact) => contact.email),
    ])
  ).filter(Boolean);

  const phoneNumbers = Array.from(
    new Set([
      primaryContact.phoneNumber,
      ...secondaryContacts.map((contact) => contact.phoneNumber),
    ])
  ).filter(Boolean);

  const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

  res.json({
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
