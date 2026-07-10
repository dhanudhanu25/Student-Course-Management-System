import React from 'react';
import AdminSidebar from './AdminSidebar';
import DarkModeToggle from './DarkModeToggle';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children, title }) => (
  <div className={styles.layout}>
    <AdminSidebar />
    <div className={styles.main}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <DarkModeToggle />
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  </div>
);

export default AdminLayout;
