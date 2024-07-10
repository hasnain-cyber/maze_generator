import { useEffect, useRef } from "react";
import { CELL_WIDTH, FRAMERATE, WINDOW_WIDTH } from "./utils/constants";
import Cell from "./types/Cell";

const nRows = Math.floor(WINDOW_WIDTH / CELL_WIDTH);
const nCols = Math.floor(WINDOW_WIDTH / CELL_WIDTH);

const MainWindow = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let grid = Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => new Cell()));
    let currentIndices = [0, 0];

    const updateCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                const x = j * CELL_WIDTH;
                const y = i * CELL_WIDTH;
                if (cell.visited) {
                    ctx.fillStyle = '#36454F';
                    ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
                } else {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
                }

                if (i === currentIndices[0] && j === currentIndices[1]) {
                    ctx.fillStyle = '#CA2C92';
                    ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
                }

                ctx.strokeStyle = 'white';
                if (cell.walls[0]) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + CELL_WIDTH, y);
                    ctx.stroke();
                }
                if (cell.walls[1]) {
                    ctx.beginPath();
                    ctx.moveTo(x + CELL_WIDTH, y);
                    ctx.lineTo(x + CELL_WIDTH, y + CELL_WIDTH);
                    ctx.stroke();
                }
                if (cell.walls[2]) {
                    ctx.beginPath();
                    ctx.moveTo(x + CELL_WIDTH, y + CELL_WIDTH);
                    ctx.lineTo(x, y + CELL_WIDTH);
                    ctx.stroke();
                }
                if (cell.walls[3]) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + CELL_WIDTH);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            });
        });
    }

    const createMaze = () => {
        grid = Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => new Cell()));

        const stack: number[][] = [];
        grid[currentIndices[0]][currentIndices[1]].visited = true;

        const getNeighbours = (i: number, j: number) => {
            const neighbours = [];
            if (i > 0 && !grid[i - 1][j].visited) neighbours.push([i - 1, j]);
            if (j < nCols - 1 && !grid[i][j + 1].visited) neighbours.push([i, j + 1]);
            if (i < nRows - 1 && !grid[i + 1][j].visited) neighbours.push([i + 1, j]);
            if (j > 0 && !grid[i][j - 1].visited) neighbours.push([i, j - 1]);
            return neighbours;
        }

        const removeWall = (i: number, j: number, i2: number, j2: number) => {
            if (i === i2) {
                if (j < j2) {
                    grid[i][j].walls[1] = false;
                    grid[i2][j2].walls[3] = false;
                } else {
                    grid[i][j].walls[3] = false;
                    grid[i2][j2].walls[1] = false;
                }
            } else {
                if (i < i2) {
                    grid[i][j].walls[2] = false;
                    grid[i2][j2].walls[0] = false;
                } else {
                    grid[i][j].walls[0] = false;
                    grid[i2][j2].walls[2] = false;
                }
            }
        }

        const draw = () => {
            updateCanvas();
            const neighbours = getNeighbours(currentIndices[0], currentIndices[1]);
            if (neighbours.length > 0) {
                stack.push(currentIndices);
                const [i, j] = neighbours[Math.floor(Math.random() * neighbours.length)];
                removeWall(currentIndices[0], currentIndices[1], i, j);
                currentIndices = [i, j];
                grid[i][j].visited = true;
            } else if (stack.length > 0) {
                currentIndices = stack.pop()!;
            }
        }

        const interval = setInterval(() => {
            draw();
            if (stack.length === 0) {
                clearInterval(interval);
            }
        }, 1000 / FRAMERATE);
    }

    useEffect(() => {
        updateCanvas();
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                createMaze();
            }
        });
    }, []);

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <canvas ref={canvasRef} width={grid.length * CELL_WIDTH} height={grid[0].length * CELL_WIDTH} style={{ background: 'black' }} />
        </div>
    )
}

export default MainWindow;