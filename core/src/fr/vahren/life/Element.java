package fr.vahren.life;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;


import java.util.concurrent.ThreadLocalRandom;

public class Element {

    public Point position;
    private Color c;
    private Life l;

    private final Color[] colors = {
            Color.BLUE, Color.RED, Color.GREEN, Color.YELLOW, Color.ORANGE, Color.PINK
    };

    public Element(int x, int y, Life life) {
        position = new Point(x,y);
        c = colors[ThreadLocalRandom.current().nextInt(colors.length)];
        l = life;
    }



    public void render(Pixmap p) {
        p.setColor(c);
        p.drawPixel(position.x+l.position.x, position.y+l.position.y);
    }
}
