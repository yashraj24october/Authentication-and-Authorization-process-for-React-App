# Authentication-and-Authorization-process-for-React-App
In this guide, we will learn how we manage users and their redirection to pages using authentication in react app when we have authentication system added.

<h3>Workflow</h3>
<ol>
  <li>first user will logged-in with admin role/authenticated user role using JWT authentication system.
</li>
<li>In routing of our react app, we will use two wrapper components:  ProtectedRoute and RoleBasedRedirect.
  <br/>
<ul>
<li><strong>ProtectedRoute Component: </strong>  ProtectedRoute Wrapper component will return the children component, only when currentUser is authenticated.
</li>
  <li><strong>RoleBasedRedirect Component: </strong>  We will use this component for homepage redirection of user. <br/>In which we will check what role current user has.
if current user has admin role, then we will redirect them to admin homepage
else
when user will have normal authentication role/unauthorized role, then we will redirect them to normal page, where he will the account menu conditionally and anySection conditionally.
Using ProtectedRoute component, in all page/section we can check the authentication of user for pages/section whether authentication needed.
</li>
</ul>
</li>
  
</ol>
