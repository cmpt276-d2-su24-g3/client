import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"

import aws_logo from './AWS_Logo.png'
import google_logo from './Google_Logo.png'

export function Login() {
  const [user, setUser] = useState({ username: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch('https://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log('User created:', data))
      .catch((error) => console.error('Error creating user:', error))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="AWS"
            src={aws_logo}
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your YYC Portal
          </h2>
          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0000FF]">Register</Link>
          </p>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div className="mt-2">
              <Input
                type="text"
                name="username"
                value={user.username}
                placeholder="Username"
                onChange={handleChange}
                className="py-6"
              />
            </div>
            <div className="mt-2">
              <Input
                type="text"
                name="password"
                value={user.password}
                placeholder="Password"
                onChange={handleChange}
                className="py-6"
              />
            </div>
            <p className="mt-10 text-center text-xs text-gray-500">
              By logging in, you agree to our{' '}
              <Link to="/login" className="text-[#0000FF]">Terms of Use</Link>
              {' '}and{' '}
              <Link to="/login" className="text-[#0000FF]">Privacy Policy</Link>
            </p>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-gray-500">
            Or sign in with
          </p>
          <br></br>
          <p className="text-center">
            <Button variant="outline" asChild>
                <Link href="/login">
                  <img
                    alt="Google"
                    src={google_logo}
                    className="h-10 mr-2"
                  />
                  Google
                </Link>
            </Button>
          </p>
        </div>
      </div>
  )
}