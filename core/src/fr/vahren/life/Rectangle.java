package fr.vahren.life;

public class Rectangle {
    public int left;
    public int right;
    public int up;
    public int down;

    public Rectangle(int l, int r, int u, int d){
        left = l;
        right = r;
        up = u;
        down = d;
    }

    public Rectangle copy() {
        return new Rectangle(left,right,up,down);
    }

    public void rotate(boolean clockwise) {
        int newL, newR, newU, newD;
        if(clockwise){
            newR = -up;
            newD = right;
            newL = -down;
            newU = left;
        }else {
            newR = down;
            newD = -left;
            newL = up;
            newU = -right;
        }
        right = newR;
        left = newL;
        up = newU;
        down = newD;
    }
}
