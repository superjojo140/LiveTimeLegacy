interface Project {
    id: string;
    name: string;
    taks : Task[];
}

interface Task{
    id:string;
    start: Date;
    end: Date;
    name: string;
}

let projects:Project[] = [];