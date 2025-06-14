import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t text-muted-foreground">
        <p className="text-xs">© 2024 SmartDoc Appointment System. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            HIPAA Compliance
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Support
          </Link>
        </nav>
      </footer>
  )
}

export default Footer
