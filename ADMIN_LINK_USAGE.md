# AdminLink Component Usage

## Overview
The AdminLink component provides a consistent way to display admin panel links across all pages of the website. It automatically shows/hides based on user admin status.

## Features
- ✅ **Automatic Visibility**: Only shows when user is logged in as admin
- ✅ **Consistent Styling**: Maintains the same look across all pages
- ✅ **Reusable**: Can be used on any page or component
- ✅ **Responsive**: Works on both desktop and mobile

## How to Use

### 1. Import the Component
```tsx
import AdminLink from '@/components/AdminLink';
import { useAdmin } from '@/hooks/useAdmin';
```

### 2. Use the Hook
```tsx
const { isAdmin } = useAdmin();
```

### 3. Add the Admin Link
```tsx
{isAdmin && (
  <AdminLink className="your-custom-classes">
    Custom Text (optional)
  </AdminLink>
)}
```

## Examples

### Basic Usage
```tsx
import AdminLink from '@/components/AdminLink';
import { useAdmin } from '@/hooks/useAdmin';

const MyPage = () => {
  const { isAdmin } = useAdmin();
  
  return (
    <div>
      <h1>My Page</h1>
      {isAdmin && <AdminLink />}
    </div>
  );
};
```

### With Custom Styling
```tsx
{isAdmin && (
  <AdminLink className="text-blue-500 hover:text-blue-700 font-bold">
    Admin Panel
  </AdminLink>
)}
```

### In Navigation Menus
```tsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/about">About</Link>
  {isAdmin && <AdminLink />}
</nav>
```

### In Sidebars
```tsx
<aside>
  <div>Menu Item 1</div>
  <div>Menu Item 2</div>
  {isAdmin && (
    <div className="mt-4">
      <AdminLink />
    </div>
  )}
</aside>
```

## Current Implementation

The AdminLink component is currently used in:
- ✅ **Header.tsx** - Desktop and mobile navigation
- ✅ **Footer.tsx** - Quick links section (example)

## Adding to New Pages

To add the admin link to any new page:

1. **Import the components**:
   ```tsx
   import AdminLink from '@/components/AdminLink';
   import { useAdmin } from '@/hooks/useAdmin';
   ```

2. **Use the hook**:
   ```tsx
   const { isAdmin } = useAdmin();
   ```

3. **Add the conditional render**:
   ```tsx
   {isAdmin && <AdminLink />}
   ```

## Styling

The AdminLink component accepts a `className` prop for custom styling:
```tsx
<AdminLink className="text-red-500 hover:text-red-700" />
```

## Behavior

- **When not logged in**: Admin link is completely hidden
- **When logged in as regular user**: Admin link is hidden
- **When logged in as admin**: Admin link is visible and clickable

## Security Note

The AdminLink component only handles UI visibility. Always ensure proper authentication and authorization on the backend for the `/admin` route.
