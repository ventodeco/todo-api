import { Todo } from './../../types/todo';

import TodoModel from './../../models/todo'

import { Request, Response } from 'express';

export const getTodos = async(req: Request, res: Response): Promise<void> => {
    const todos: Todo[] = await TodoModel.find()

    res.status(200).json({ todos })
}

export const getTodo = async(req: Request, res: Response): Promise<void> => {
    await TodoModel.findById(req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        } else {
            res.status(200).json({
                result
            })
        }
    })
}

export const addTodo = async(req: Request, res: Response): Promise<void> => {
    const body: Pick<Todo, 'title' | 'status'> = req.body

    if (!body.title || !body.status) {
        res.status(403).json({
            status: 403,
            errorMessage: `ValidationError: Todo validation failed: title: ${body.title}, status: ${body.status}`
        })

        return
    }

    const newTodoModel = new TodoModel({
        title: body.title,
        status: body.status
    })

    const newTodo = await newTodoModel.save()
    const updatedAllTodosAfterSave = await TodoModel.find()

    res.status(201).json({
        message: 'Todo successfully added',
        addedTodo: newTodo,
        allTodoAfterAddition: updatedAllTodosAfterSave
    })
}

export const updateTodo = async(req: Request, res: Response): Promise<void> => {
    const {
        params: { id },
        body
    } = req

    if (!body.title || !body.status || !id) {
        res.status(403).json({
            status: 403,
            errorMessage: `ValidationError: _id or body not defined`
        })

        return
    }

    const updatedModel = await TodoModel.findByIdAndUpdate({ _id: id }, body)
    const updatedAllTodosAfterUpdated = await TodoModel.find()

    if (!updateTodo) {
        res.status(501).json({
            status: 501,
            errorMessage: `Edit Todo failed. Not implemented`
        })

        return
    }

    res.status(200).json({
        status: 200,
        updatedModel,
        updatedAllTodosAfterUpdated
    })
}

export const removeTodo = async (req: Request, res: Response): Promise<void> => {
    const {
        params: { id }
    } = req 

    if (!id) {
        res.status(403).json({
            status: 403,
            errorMessage: `ValidationError: id not defined`
        })

        return 
    }

    const removedTodo = await TodoModel.findByIdAndRemove(id)
    const updatedAllTodoAfterRemove = await TodoModel.find()
    
    if (!removedTodo) {
        res.status(501).json({
            status: 501,
            errorMessage: `Remove todo failed.`
        })

        return 
    }

    res.status(200).json({
        message: `Todo success removed`,
        removedTodo,
        updatedAllTodoAfterRemove
    }) 
}