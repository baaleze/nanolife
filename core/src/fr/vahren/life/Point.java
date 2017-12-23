package fr.vahren.life;

public class Point {

    public int x;
    public int y;

    public Point(int x,int y){
        this.x = x;
        this.y = y;
    }

    public void rotate(int nb90, boolean clockwise){
        for(int i = 0;i<nb90;i++){
            rotate90(clockwise);
        }
    }

    public void rotate90(boolean clockwise){
        x = clockwise ? -y : y;
        y = clockwise ? x : -x;
    }

}
