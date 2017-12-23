package fr.vahren.life;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.Color;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

public class Life {

    LifeWorld world;
    Point position;

    List<Element> elements = new ArrayList<>(0);
    private Rectangle bbox;

    public Life(int x, int y, LifeWorld w) {
        position = new Point(x, y);
        this.world = w;
        bbox = boundingBox();
    }

    public void act() {
        int action = ThreadLocalRandom.current().nextInt(5);
        switch (action) {
            case 0:
            case 1:
            case 2:
            case 3:
                move();
                break;
            case 4:
                grow(0, 0);
                break;
        }
    }

    public void render(Pixmap p) {
        // draw core
        p.setColor(Color.BLACK);
        p.drawPixel(position.x,position.y);

        elements.forEach(e -> e.render(p));
    }

    public void grow(int x, int y) {

        // is the space empty ?
        if (world.canGrowHere(x + position.x, y + position.y)) {
            // GROW!
            elements.add(new Element(x, y, this));
            // refresh bbox
            refreshBoundingBox();
        } else {

            // choose a side to grow
            switch (getDir(x + position.x, y + position.y)) {
                case UP:
                    grow(x, y - 1);
                    break;
                case DOWN:
                    grow(x, y + 1);
                    break;
                case LEFT:
                    grow(x - 1, y);
                    break;
                case RIGHT:
                    grow(x + 1, y);
                    break;

            }
        }
    }

    private void refreshBoundingBox() {
        this.bbox = boundingBox();
    }

    public void move() {
        switch (getDir(position.x, position.y)) {
            case RIGHT:
                position.x = position.x + 1;
                break;
            case LEFT:
                position.x = position.x - 1;
                break;
            case DOWN:
                position.y = position.y + 1;
                break;
            case UP:
                position.y = position.y - 1;
                break;

        }
    }

    private static Dir getDir() {
        return Dir.values()[ThreadLocalRandom.current().nextInt(4)];
    }

    private Rectangle boundingBox() {
        // min bounding box is core
        int left = 0, right = 0, up = 0, down = 0;

        for (Element element : elements) {
            if (element.x() < left) {
                left = element.x();
            }
            if (element.x() > right) {
                right = element.x();
            }
            if (element.y() < up) {
                up = element.y();
            }
            if (element.y() > down) {
                down = element.y();
            }
        }

        return new Rectangle(left, right, up, down);
    }

    private Dir getDir(int x, int y) {
        List<Dir> available = new ArrayList<>(0);
        if (x + bbox.left > 0) {
            available.add(Dir.LEFT);
        }
        if (x + bbox.right < LifeApp.WIDTH - 1) {
            available.add(Dir.RIGHT);
        }
        if (y + bbox.up > 0) {
            available.add(Dir.UP);
        }
        if (y + bbox.down < LifeApp.HEIGHT - 1) {
            available.add(Dir.DOWN);
        }
        if (available.isEmpty()) {
            return Dir.NONE;
        } else {
            return Optional.ofNullable(available.get(ThreadLocalRandom.current().nextInt(available.size()))).orElse(Dir.NONE);
        }
    }

    enum Dir {
        LEFT, UP, RIGHT, DOWN, NONE
    }
}
