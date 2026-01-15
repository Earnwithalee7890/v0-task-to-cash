"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-gray-900/50 rounded-2xl border border-red-500/20 glass-morphism">
                    <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
                    <p className="text-gray-400 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                        Try again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
