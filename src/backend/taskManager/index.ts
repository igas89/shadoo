export interface TaskManagerProps {
    requestLimit: number;
    endQueue?(): void;
}

export interface TaskManagerQueue {
    task: (taskId: number) => void;
    taskId: number;
    work: boolean;
}

export default class TaskManager {
    private _queue: TaskManagerQueue[] = [];
    private _endQueue: TaskManagerProps['endQueue'];
    private _taskId: number = 1;
    private _requestLimit: number = 0;

    constructor(props: TaskManagerProps) {
        this._requestLimit = props.requestLimit;
        this._endQueue = props.endQueue;
    }

    public run() {
        console.log(`[TaskManager]: в очереди ${this.size()} запросов`);

        this._queue.forEach(({ task, taskId }, index, arr) => {
            if (index + 1 <= this._requestLimit) {
                arr[index].work = true;
                task(taskId);
            }
        });
    }

    public enqueue(task: TaskManagerQueue['task']) {
        const taskId = this._taskId;
        this._queue.push({ taskId, task, work: false });
        this._taskId++;
    }

    public dequeue(taskId: number): void {
        const index = this._queue.findIndex((queue) => queue.taskId === taskId);

        if (index !== -1 && this._queue[index].work) {
            this._queue.splice(index, 1);
        }

        if (this.size()) {
            const filterQueue = this._queue.filter((queue) => !queue.work);

            if (!filterQueue.length) {
                return;
            }

            const { task, taskId: newTaskId, work } = filterQueue.slice(0, 1)[0];

            if (work) {
                return;
            }

            const index = this._queue.findIndex((queue) => queue.taskId === newTaskId);
            this._queue[index].work = true;
            task(newTaskId);
        }

        if (!this.size() && this._endQueue instanceof Function) {
            this._endQueue();
        }
    }

    public size(): number {
        return this._queue.length;
    }
}