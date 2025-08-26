'use client'

import { useState, useEffect, useRef } from 'react'

interface CellData {
  content: string
  backgroundColor: string
}

interface EditModalProps {
  isOpen: boolean
  cellData: CellData
  onSave: (data: CellData) => void
  onClose: () => void
}

function EditModal({ isOpen, cellData, onSave, onClose }: EditModalProps) {
  const [content, setContent] = useState(cellData.content)
  const [backgroundColor, setBackgroundColor] = useState(cellData.backgroundColor)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContent(cellData.content)
    setBackgroundColor(cellData.backgroundColor)
  }, [cellData])

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.innerHTML = cellData.content || ''
      editorRef.current.focus()
    }
  }, [isOpen, cellData.content])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && isOpen) {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, backgroundColor, content])

  const handleSave = () => {
    onSave({
      content: content,
      backgroundColor
    })
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    // Update content state after formatting
    setTimeout(() => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
      }
    }, 0)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    // Update content state after paste
    setTimeout(() => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
      }
    }, 0)
  }

  const colors = [
    // First row - full colors (9 colors)
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Yellow', value: '#ca8a04' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Gray', value: '#6b7280' },
    // Second row - lighter versions (9 colors)
    { name: 'Light Red', value: '#fca5a5' },
    { name: 'Light Orange', value: '#fdba74' },
    { name: 'Light Yellow', value: '#fde047' },
    { name: 'Light Green', value: '#86efac' },
    { name: 'Light Teal', value: '#5eead4' },
    { name: 'Light Blue', value: '#93c5fd' },
    { name: 'Light Purple', value: '#c4b5fd' },
    { name: 'Light Pink', value: '#fbcfe8' },
    { name: 'Clear', value: '' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Edit Cell</h3>
        
        {/* Rich Text Editor */}
        <div className="mb-4">
          <div
            ref={editorRef}
            contentEditable
            onPaste={handlePaste}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            className="w-full min-h-[150px] max-h-[300px] overflow-y-auto p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: backgroundColor || 'white' }}
            suppressContentEditableWarning
          />
        </div>
        
        {/* Formatting Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onMouseDown={(e) => { e.preventDefault(); formatText('bold') }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); formatText('italic') }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 italic"
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); formatText('underline') }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 underline"
            title="Underline (Ctrl+U)"
          >
            U
          </button>
          <div className="border-l border-gray-300 mx-2"></div>
          <button
            onMouseDown={(e) => { e.preventDefault(); formatText('removeFormat') }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            title="Clear formatting"
          >
            Clear Format
          </button>
        </div>
        
        {/* Color Picker */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Background Color:</p>
          <div className="grid grid-cols-9 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setBackgroundColor(color.value)}
                className={`h-10 rounded border-2 transition-all ${
                  backgroundColor === color.value 
                    ? 'border-gray-800 scale-110 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-500'
                } ${color.value === '' ? 'bg-white' : ''}`}
                style={{ backgroundColor: color.value || 'white' }}
                title={color.name}
              >
                {color.value === '' && <span className="text-xs text-gray-500">×</span>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Help text */}
        <div className="mb-4 text-xs text-gray-500">
          <p>• Select text to apply formatting</p>
          <p>• Press Shift+Enter for new line</p>
          <p>• Press Enter to save</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel (Esc)
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save (Enter)
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  const getEmptyCellData = (): Record<string, CellData> => {
    const data: Record<string, CellData> = {}
    periods.forEach((period) => {
      days.forEach((day) => {
        data[`${period}-${day}`] = {
          content: '',
          backgroundColor: ''
        }
      })
    })
    return data
  }

  const [cellData, setCellData] = useState<Record<string, CellData>>(getEmptyCellData())
  const [isLoaded, setIsLoaded] = useState(false)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scheduleData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        // Migrate old data format if needed
        const migratedData: Record<string, CellData> = {}
        Object.keys(parsedData).forEach(key => {
          const cell = parsedData[key]
          if (typeof cell.content === 'string') {
            migratedData[key] = {
              content: cell.content,
              backgroundColor: cell.backgroundColor || ''
            }
          } else {
            migratedData[key] = cell
          }
        })
        setCellData(migratedData)
      } catch (e) {
        console.error('Failed to load schedule data:', e)
      }
    }
    setIsLoaded(true)
  }, [])
  
  // Save to localStorage whenever data changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('scheduleData', JSON.stringify(cellData))
    }
  }, [cellData, isLoaded])
  
  const handleCellClick = (cellId: string) => {
    setEditingCell(cellId)
  }
  
  const handleSave = (data: CellData) => {
    if (editingCell) {
      setCellData(prev => ({
        ...prev,
        [editingCell]: data
      }))
      setEditingCell(null)
    }
  }
  
  const renderCellContent = (cellId: string) => {
    const data = cellData[cellId]
    if (!data || !data.content) return null
    
    return (
      <div 
        className="text-sm overflow-hidden text-center w-full"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white p-8 flex items-center">
      <div className="w-full">
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center font-cooper">My Schedule</h1>

        <div className="max-w-7xl mx-auto">
        {/* Main grid with times */}
        <div className="relative">
          {/* Time labels - positioned outside the grid */}
          <div className="absolute -left-20 top-0">
            {/* Header is approximately 57px tall */}
            {/* 8:50 - top of P1 (57px from top) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '57px', transform: 'translateY(-50%)' }}>
              8:50
            </div>
            {/* 9:50 - after P1 (57 + 80 = 137px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '137px', transform: 'translateY(-50%)' }}>
              9:50
            </div>
            {/* 10:40 - after P2, top of recess line (57 + 160 = 217px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '217px', transform: 'translateY(-50%)' }}>
              10:40
            </div>
            {/* 11:00 - bottom of recess line (57 + 160 + 16 = 233px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '233px', transform: 'translateY(-50%)' }}>
              11:00
            </div>
            {/* 11:50 - after P3 (57 + 160 + 16 + 80 = 313px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '313px', transform: 'translateY(-50%)' }}>
              11:50
            </div>
            {/* 12:40 - after P4, top of lunch line (57 + 160 + 16 + 160 = 393px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '393px', transform: 'translateY(-50%)' }}>
              12:40
            </div>
            {/* 1:40 - bottom of lunch line (57 + 160 + 16 + 160 + 32 = 425px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '425px', transform: 'translateY(-50%)' }}>
              1:40
            </div>
            {/* 2:30 - after P5 (57 + 160 + 16 + 160 + 32 + 80 = 505px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '505px', transform: 'translateY(-50%)' }}>
              2:30
            </div>
            {/* 3:20 - bottom of P6 (57 + 160 + 16 + 160 + 32 + 160 = 585px) */}
            <div className="absolute text-sm text-gray-600 text-right w-16" style={{ top: '585px', transform: 'translateY(-50%)' }}>
              3:20
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-5 bg-gray-100 border-b border-gray-300">
              {days.map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-gray-800 border-r border-gray-300 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Period rows */}
            <div className="relative">

              {/* P1 */}
              <div className="grid grid-cols-5 border-b border-gray-300">
                {days.map((day) => {
                  const cellId = `P1-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
              </div>

              {/* P2 */}
              <div className="grid grid-cols-5 relative" style={{ borderBottom: '16px solid rgb(75 85 99)' }}>
                {days.map((day) => {
                  const cellId = `P2-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
                {/* Recess text in the thick border */}
                <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ bottom: '-16px', height: '16px' }}>
                  <span className="text-white text-sm font-medium tracking-wide">RECESS</span>
                </div>
              </div>

              {/* P3 */}
              <div className="grid grid-cols-5 border-b border-gray-300">
                {days.map((day) => {
                  const cellId = `P3-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
              </div>

              {/* P4 */}
              <div className="grid grid-cols-5 relative" style={{ borderBottom: '32px solid rgb(75 85 99)' }}>
                {days.map((day) => {
                  const cellId = `P4-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
                {/* Lunch text in the thick border */}
                <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ bottom: '-32px', height: '32px' }}>
                  <span className="text-white text-2xl font-medium tracking-wider">LUNCH</span>
                </div>
              </div>

              {/* P5 */}
              <div className="grid grid-cols-5 border-b border-gray-300">
                {days.map((day) => {
                  const cellId = `P5-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
              </div>

              {/* P6 */}
              <div className="grid grid-cols-5">
                {days.map((day) => {
                  const cellId = `P6-${day}`
                  const data = cellData[cellId]
                  return (
                    <div 
                      key={cellId} 
                      onClick={() => handleCellClick(cellId)}
                      className="h-20 p-2 border-r border-gray-300 last:border-r-0 hover:opacity-90 transition-opacity cursor-pointer overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: data?.backgroundColor || 'white' }}
                    >
                      {renderCellContent(cellId)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
        {/* Edit Modal */}
        {editingCell && (
          <EditModal
            isOpen={!!editingCell}
            cellData={cellData[editingCell]}
            onSave={handleSave}
            onClose={() => setEditingCell(null)}
          />
        )}
      </div>
    </div>
  )
}