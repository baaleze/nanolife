package fr.vahren.life.ai;

import org.deeplearning4j.rl4j.space.Encodable;

public class State implements Encodable{

    private int food;
    private int foodAround;
    private int lifetime;
    private int size;
    private int dir;
    private int x;
    private int y;

    public State(int food, int foodAround, int lifetime, int size, int dir, int x, int y) {
        this.food = food;
        this.foodAround = foodAround;
        this.lifetime = lifetime;
        this.size = size;
        this.dir = dir;
        this.x = x;
        this.y = y;
    }

    @Override
    public double[] toArray() {
        return new double[]{
                food, foodAround, lifetime, size, dir, x, y
        };
    }

    @Override
    public String toString() {
        return "State{" +
                "food=" + food +
                ", foodAround=" + foodAround +
                ", lifetime=" + lifetime +
                ", size=" + size +
                ", dir=" + dir +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}
