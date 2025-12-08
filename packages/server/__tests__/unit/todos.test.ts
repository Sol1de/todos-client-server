import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllTodos, addTodo, toggleTodo, deleteTodo } from '../../src/todos.js'

// Mock du module storage
vi.mock('../../src/storage.js', () => ({
  readTodos: vi.fn(),
  writeTodos: vi.fn()
}))

import { readTodos, writeTodos } from '../../src/storage.js'

const mockReadTodos = vi.mocked(readTodos)
const mockWriteTodos = vi.mocked(writeTodos)

describe('todos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllTodos', () => {
    it('should return all todos from storage', async () => {
      const mockTodos = [
        { id: '1', text: 'Test todo 1', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
        { id: '2', text: 'Test todo 2', completed: true, createdAt: '2024-01-02T00:00:00.000Z' }
      ]
      mockReadTodos.mockResolvedValue(mockTodos)

      const result = await getAllTodos()

      expect(mockReadTodos).toHaveBeenCalledOnce()
      expect(result).toEqual(mockTodos)
    })
  })

  describe('addTodo', () => {
    it('should create a new todo with correct properties', async () => {
      mockReadTodos.mockResolvedValue([])
      mockWriteTodos.mockResolvedValue(undefined)

      const result = await addTodo('New todo')

      expect(result).toMatchObject({
        text: 'New todo',
        completed: false
      })
      expect(result.id).toBeDefined()
      expect(Number(result.id)).not.toBeNaN()
      expect(result.createdAt).toBeDefined()
    })
  })

  describe('toggleTodo', () => {
    it('should toggle completed status from false to true', async () => {
      const mockTodos = [
        { id: '1', text: 'Test todo', completed: false, createdAt: '2024-01-01T00:00:00.000Z' }
      ]
      mockReadTodos.mockResolvedValue(mockTodos)
      mockWriteTodos.mockResolvedValue(undefined)

      const result = await toggleTodo('1')

      expect(result?.completed).toBe(true)
      expect(mockWriteTodos).toHaveBeenCalledOnce()
    })

    it('should toggle completed status from true to false', async () => {
      const mockTodos = [
        { id: '1', text: 'Test todo', completed: true, createdAt: '2024-01-01T00:00:00.000Z' }
      ]
      mockReadTodos.mockResolvedValue(mockTodos)
      mockWriteTodos.mockResolvedValue(undefined)

      const result = await toggleTodo('1')

      expect(result?.completed).toBe(false)
    })
  })

  describe('deleteTodo', () => {
    it('should remove todo from list', async () => {
      const mockTodos = [
        { id: '1', text: 'Todo 1', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
        { id: '2', text: 'Todo 2', completed: true, createdAt: '2024-01-02T00:00:00.000Z' }
      ]
      mockReadTodos.mockResolvedValue(mockTodos)
      mockWriteTodos.mockResolvedValue(undefined)

      const result = await deleteTodo('1')

      const writtenTodos = mockWriteTodos.mock.calls[0][0] as { id: string }[]
      expect(writtenTodos).toHaveLength(1)
      expect(writtenTodos[0].id).toBe('2')
      expect(result).toEqual({ success: true })
    })
  })
})