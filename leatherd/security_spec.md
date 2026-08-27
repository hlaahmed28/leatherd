# Security Specification - Cairo Pashmina Shop

## Data Invariants
1. **Products**: Must have a valid `id`, `name`, `price` (>0), and `category`.
2. **Orders**: Must have `customerName`, `email`, `phone`, `total` (>0), and at least one `item`. `orderNumber` must be unique (or at least present).
3. **Settings**: Singleton document at `/settings/global`.
4. **PromoCodes**: Must have `code` and `value`.
5. **Admins**: Users must be indexed in `/admins/{uid}` to have admin privileges.

## The "Dirty Dozen" Payloads (Target: Permission Denied)
1. **Identity Theft**: non-admin trying to update a product price.
2. **Shadow Field**: including `isVerified: true` in an order.
3. **Negative Price**: creating a product with `price: -100`.
4. **ID Poisoning**: using a 2KB string as a product ID.
5. **Unauthorized Order Read**: non-admin trying to list all orders.
6. **Setting Overwrite**: non-admin trying to change the store's WhatsApp number.
7. **Privilege Escalation**: a user trying to create an entry for themselves in `/admins/`.
8. **Invalid Promo Value**: admin trying to set a `percentage` discount to `150` (if we had such a constraint, but let's stick to basic schema).
9. **Orphaned Order**: creating an order without any items.
10. **Customer Data Leak**: non-admin trying to read the `/customers/` collection.
11. **Review Spam**: non-admin trying to delete reviews.
12. **System Field Injection**: trying to update `usageCount` of a promo code directly from client without proper validation.

## Test Runner (Logic Verification)
The `firestore.rules` will be verified against these patterns.
