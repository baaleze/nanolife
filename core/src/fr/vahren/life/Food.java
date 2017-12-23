package fr.vahren.life;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;

/**
 * Created by baaleze on 23/12/2017.
 */
public class Food {

    Point position;

    public Food(int x, int y){
        position = new Point(x,y);
    }

    public void render(Pixmap p) {
        p.setColor(Color.TEAL);
        p.drawPixel(position.x,position.y);
    }
}
