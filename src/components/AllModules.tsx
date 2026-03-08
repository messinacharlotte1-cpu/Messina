// All Modules - Lazy loaded component
'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Re-export types
export type UserRole = 'dm' | 'superviseur' | 'comptabilite' | 'marketing' | 'admin'
export type Module = 'dashboard' | 'geolocation' | 'crm' | 'accounting' | 'marketing' | 'analytics' | 'settings' | 'hcp' | 'planning' | 'budget' | 'reports' | 'rh' | 'payroll' | 'my-space' | 'messages' | 'stocks' | 'sales' | 'regulatory' | 'laboratories'

// Import the backup file which contains all the modules
// This file will be code-split and loaded on demand
import AllModulesContent from './AllModulesContent'

interface AllModulesProps {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
    region?: string
    country?: string
    phone?: string
    supervisorId?: string
  }
  module: Module
  setModule: (module: Module) => void
}

export default function AllModules({ user, module, setModule }: AllModulesProps) {
  return <AllModulesContent user={user} module={module} setModule={setModule} />
}
